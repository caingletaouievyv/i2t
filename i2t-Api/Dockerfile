# -------------------
# Build stage (compile app)
# -------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY i2t-Api/*.csproj ./
RUN dotnet restore "i2t-Api.csproj"

COPY i2t-Api/. ./
RUN dotnet publish "i2t-Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# install runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr libtesseract-dev libleptonica-dev hunspell hunspell-en-us \
    && rm -rf /var/lib/apt/lists/*

# copy published app
COPY --from=build /app/publish .

# copy tessdata + dictionaries
COPY i2t-Api/tessdata /app/tessdata
COPY i2t-Api/Dictionaries /app/Dictionaries
ENV TESSDATA_PREFIX=/app/tessdata

# setup probing libs
RUN mkdir -p /app/x64 /app/x86 \
 && cp -f /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/libleptonica-1.82.0.so \
 && cp -f /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/x64/libleptonica-1.82.0.so \
 && cp -f /usr/lib/x86_64-linux-gnu/liblept.so.5 /app/x86/libleptonica-1.82.0.so \
 && chmod 755 /app/*.so /app/x64/*.so /app/x86/*.so \
 && ldd /app/x64/libleptonica-1.82.0.so

ENV LD_LIBRARY_PATH=/app:/app/x64:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "i2t-Api.dll"]
