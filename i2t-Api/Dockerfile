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

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    hunspell \
    hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# Symlink so .NET can find expected filename
RUN ln -sf /usr/lib/x86_64-linux-gnu/liblept.so.5 \
           /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so

ENV LD_LIBRARY_PATH=/app:/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH

COPY --from=build /app/publish .

# Extra copy for InteropDotNet probing
RUN cp -f /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so \
 && ldconfig

# Sanity check: fail build if the library isn't in place
RUN test -f /usr/lib/x86_64-linux-gnu/libleptonica-1.82.0.so \
 && test -f /app/libleptonica-1.82.0.so

COPY i2t-Api/tessdata /usr/share/tesseract-ocr/4.00/tessdata
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

COPY i2t-Api/Dictionaries /usr/share/hunspell

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
