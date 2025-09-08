# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install OCR + Hunspell deps
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Symlink to match Tesseract .NET wrapper expectations
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so

# Copy published app
COPY --from=build /app/publish .

# Copy tessdata + dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries

# OCR env vars
ENV TESSDATA_PREFIX=/app/tessdata
ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
